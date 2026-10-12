/* eslint-disable @typescript-eslint/naming-convention */
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import env from '#start/env'
import fs from 'node:fs'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

interface PresignedUrlParams {
  folder: string
  fileName: string
  contentType?: string
  expiresIn?: number
}

const DEFAULT_READ_URL_TTL_SECONDS = 3600

export default class UploadService {
  private s3Client: S3Client
  private bucketName: string

  constructor() {
    this.bucketName = env.get('S3_BUCKET', '') as string
    this.s3Client = new S3Client({
      region: env.get('S3_REGION', 'eu-west-1') as string,
      credentials: {
        accessKeyId: env.get('S3_ACCESS_KEY', '') as string,
        secretAccessKey: env.get('S3_SECRET_KEY', '') as string,
      },
    })
  }

  /**
   * Generates an S3 Presigned URL for direct uploads from the client-side.
   */
  public async generateUploadSignature(params: PresignedUrlParams) {
    const { folder, fileName, contentType, expiresIn = 3600 } = params
    const key = `${folder}/${Date.now()}-${fileName}`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    })

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn,
    })

    return {
      url: signedUrl,
      key,
      bucket: this.bucketName,
    }
  }

  /**
   * Uploads a file to S3 directly from the server.
   * @param file The multipart file from AdonisJS request
   * @param folder The folder path in S3
   * @returns Public/S3 URL of the uploaded file, or null
   */
  public async uploadFile(file: MultipartFile, folder: string): Promise<string | null> {
    if (!file || !file.tmpPath) {
      console.error('No file or temporary path provided for upload.')
      return null
    }

    const key = `${folder}/${Date.now()}-${file.clientName}`
    const fileStream = fs.createReadStream(file.tmpPath)

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileStream,
        ContentType: file.headers['content-type'],
      })

      await this.s3Client.send(command)
      return `https://${this.bucketName}.s3.${env.get('S3_REGION', 'eu-west-1')}.amazonaws.com/${key}`
    } catch (error) {
      console.error('Error uploading file to S3:', error)
      return null
    }
  }

  /**
   * Generates a signed GET URL for downloading or viewing private files.
   */
  public async getSignedReadUrl(key: string, expiresInSeconds: number = DEFAULT_READ_URL_TTL_SECONDS): Promise<string | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })

      return await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      })
    } catch (error) {
      console.error('Failed to generate S3 read URL:', error)
      return null
    }
  }

  /**
   * Deletes an object from S3.
   */
  public async deleteFile(key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
      await this.s3Client.send(command)
      return true
    } catch (error) {
      console.error('Failed to delete file from S3:', error)
      return false
    }
  }
}
