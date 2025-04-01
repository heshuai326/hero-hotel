
import { expect } from '@loopback/testlab';
import { ReservationRepository } from '../../../repositories';
import { CouchbaseServiceMock } from '../../mock/couchbase.service.mock';
import { v4 as uuidv4 } from 'uuid';
import { ReservationStatus} from "shared";


describe('ReservationRepository', () => {
	let repository: ReservationRepository;
	let couchbaseMock: CouchbaseServiceMock;

	const guestNameMock = "heshuai"
	const reservationMock = {
		guestName: guestNameMock,
		guestContact: 'heshuai@example.com',
		status: ReservationStatus.PENDING,
		userId: 'user-123',
		tableSize: 4,
		arrivalTime: new Date().toISOString(),
	}

	beforeEach(() => {
		couchbaseMock = new CouchbaseServiceMock();
		repository = new ReservationRepository(couchbaseMock as any);
	});

	afterEach(() => {
		couchbaseMock.clear();
	});

	describe('create()', () => {
		it('creates a reservation with generated ID', async () => {
			const reservationData = reservationMock

			const result = await repository.create(reservationData);

			expect(result).to.have.property('id');
			expect(result.id).to.match(/^[0-9a-f-]{36}$/);
			expect(result.guestName).to.equal(reservationData.guestName);
		});
	});

	describe('findOne()', () => {
		it('returns existing reservation', async () => {
			const id = uuidv4();
			await couchbaseMock.upsert(id, {
				id,
			 ...reservationMock
			});

			const result = await repository.findOne(id);
			expect(result).to.have.property('id', id);
		});

		it('returns null for non-existent reservation', async () => {
			const result = await repository.findOne('non-existent-id');
			expect(result).to.be.null();
		});
	});

	describe('find()', () => {
		beforeEach(async () => {
			const id1 = "id-1"
			const id2 = "id-2"
			await couchbaseMock.upsert(id1, {...reservationMock, id1});

			await couchbaseMock.upsert(id2, {...reservationMock, id1});
		});

		it('returns all reservations when no query provided', async () => {
			const result = await repository.find();
			expect(result).to.have.length(2);
			expect(result[0].id).to.equal('id-2'); // 验证按时间降序
		});

		it('filters by status', async () => {
			const result = await repository.find({ status: ReservationStatus.CONFIRMED });
			expect(result).to.have.length(1);
			expect(result[0].guestName).to.equal(guestNameMock);
		});

		it('filters by guestName with LIKE', async () => {
			const result = await repository.find({ guestName: 'shuai' });
			expect(result).to.have.length(1);
			expect(result[0].id).to.equal('id-1');
		});
	});

	describe('updateOne()', () => {
		it('updates existing reservation', async () => {
			const id = uuidv4();
			await couchbaseMock.upsert(id, { ...reservationMock});

			const updated = await repository.updateOne(id, { status: ReservationStatus.CONFIRMED });
			expect(updated.status).to.equal(ReservationStatus.CONFIRMED );

			const stored = await couchbaseMock.get(id);
			expect(stored?.status).to.equal(ReservationStatus.CONFIRMED);
		});

		it('throws error for non-existent reservation', async () => {
			await expect(
				repository.updateOne('non-existent-id', { status: ReservationStatus.CONFIRMED })
			).to.be.rejectedWith(/not found/);
		});
	});
});