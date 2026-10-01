/* eslint-disable @typescript-eslint/no-explicit-any */
export const DefaultProcessBatchWaitTime = 250;

export const DefaultCooldown = 1000;

export const DefaultMaxConcurrentBatches = 5;

export enum BatchRequestError {
  processFailure = 'processFailure',
  unretriableFailure = 'unretriableFailure',
  maxAttemptsReached = 'maxAttemptsReached',
}

export type BatchIdSerializer = (id: number) => string;

export type BatchItemProcessor<T> = (ids: Array<QueueItem<T>>) => Promise<ItemProcessorResult<T>>;

export type FailureCooldownProcessor = (attempts: number) => number;

export type ItemExpirationProcessor = (key: string) => any;

export interface BatchRequestParameters {
  getFailureCooldown: FailureCooldownProcessor;
  maxRetryAttempts: number;
  batchSize: number;
  processBatchWaitTime?: number;
  maxConcurrentBatches?: number;
  getItemExpiration?: ItemExpirationProcessor;
}

export interface BatchRequestProperties extends BatchRequestParameters {
  processBatchWaitTime: number;
  maxConcurrentBatches: number;
}

export interface QueueItem<T> {
  key: string;
  itemId: number;
  retryAttempts: number;
  queueAfter: number;
  startTime: Date;
  resolve: QueueResolver;
  reject: QueueRejecter;
}

export type QueueResolver = (item: any) => any;
export type QueueRejecter = (error: BatchRequestError) => any;

export type ItemProcessorResult<T> = { [key: string]: T };

export interface BatchRequestFactory {}
