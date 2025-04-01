// src/__tests__/mock/couchbase.service.mock.ts
import { AnyObject } from '@loopback/repository';

export class CouchbaseServiceMock {
	private data = new Map<string, AnyObject>();

	async get(id: string): Promise<AnyObject | undefined> {
		return this.data.get(id);
	}

	async upsert(id: string, doc: AnyObject): Promise<AnyObject> {
		this.data.set(id, doc);
		return doc;
	}

	async query(query: string, options?: AnyObject): Promise<{ rows: AnyObject[] }> {
		// 简单模拟查询逻辑
		const rows = Array.from(this.data.values())
			.filter(item => item.type === 'reservation')
			.filter(item => {
				if (options?.parameters?.status) {
					return item.status === options.parameters.status;
				}
				return true;
			})
			.sort((a, b) => new Date(b.arrivalTime).getTime() - new Date(a.arrivalTime).getTime());

		return { rows };
	}

	clear() {
		this.data.clear();
	}
}