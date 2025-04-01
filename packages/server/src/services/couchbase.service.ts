import { BindingScope, inject, injectable } from "@loopback/core"
import * as couchbase from "couchbase"
import { QueryOptions } from "couchbase/dist/querytypes"
import { TYPES } from "../types"

@injectable({ scope: BindingScope.SINGLETON })
export class CouchbaseService {
	private cluster!: couchbase.Cluster
	private bucket!: couchbase.Bucket
	private isConnected = false

	constructor(
		@inject(TYPES.CouchbaseConfig)
		private config: {
			connectionString: string
			username: string
			password: string
			bucketName: string
		},
	) {}

	async connect(): Promise<void> {
		if (this.isConnected) return

		try {
			this.cluster = await couchbase.connect(this.config.connectionString, {
				username: this.config.username,
				password: this.config.password,
			})

			this.bucket = this.cluster.bucket(this.config.bucketName)
			this.isConnected = true
		} catch (err) {
			throw new Error(`Couchbase连接失败: ${err.message}`)
		}
	}

	async close(): Promise<void> {
		if (this.isConnected) {
			await this.cluster.close()
		}
	}

	async get(key: string): Promise<any> {
		try {
			await this.connect()
			const collection = this.bucket.defaultCollection()
			const result = await collection.get(key)
			// await this.close()
			return result.content
		} catch (err) {
			console.log(`get ${key} err ${err}`)
			return undefined
		}
	}

	async upsert<T>(key: string, value: T): Promise<T> {
		console.log(key)
		console.log(value)
		await this.connect()
		const collection = this.bucket.defaultCollection()
		const result = await collection.upsert(key, value)
		const res = await collection.get(key)
		// await this.close()
		return res.content
	}

	async query(query: string, options: QueryOptions): Promise<any> {
		await this.connect()
		const result = await this.cluster.query(query, options)
		await this.close()
		return result
	}
}
