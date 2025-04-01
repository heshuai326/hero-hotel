import * as couchbase from "couchbase"

export class CouchbaseServiceMock {
	private mockData: Map<string, any> = new Map()
	private cluster!: couchbase.Cluster
	private bucket!: couchbase.Bucket
	isConnected: boolean = true
	config: any = {}

	setMockData(id: string, data: any): void {
		this.mockData.set(id, data)
	}

	async connect(): Promise<void> {
		this.isConnected = true
	}

	async close(): Promise<void> {
		if (this.isConnected) {
			await this.cluster.close()
		}
	}

	async disconnect(): Promise<void> {
		this.isConnected = false
	}

	async get(id: string): Promise<any> {
		if (!this.isConnected) throw new Error("Not connected")
		const data = this.mockData.get(id)
		if (!data) throw new Error(`Reservation with id ${id} not found`)
		return data
	}

	async upsert(id: string, data: any): Promise<any> {
		if (!this.isConnected) throw new Error("Not connected")
		this.mockData.set(id, data)
		return data
	}

	async query(query: string, options?: any): Promise<any> {
		if (!this.isConnected) throw new Error("Not connected")
		const allData = Array.from(this.mockData.values())

		if (options?.parameters?.status) {
			return {
				rows: allData.filter((item: any) => item.status === options.parameters.status),
			}
		}

		return { rows: allData }
	}
}
