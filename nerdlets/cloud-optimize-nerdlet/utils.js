import { UserStorageQuery, UserStorageMutation } from 'nr1';
import gql from 'graphql-tag';
 
export const getCollection = async (collection) => {
    let result = await UserStorageQuery.query({ collection: collection })
    let collectionResult = (result || {}).data || []
    return collectionResult
}

export const writeDocument = async (collection, documentId, payload) => {
  let result = await UserStorageMutation.mutate({
                  actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
                  collection: collection,
                  documentId: documentId,
                  document: payload
                })
  return result
}

export const deleteDocument = async (collection, documentId) => {
  let result = await UserStorageMutation.mutate({
                  actionType: UserStorageMutation.ACTION_TYPE.DELETE_DOCUMENT,
                  collection: collection,
                  documentId: documentId
                })
  return result
}

export const accountsQuery = gql`{
  actor {
    accounts {
      id
      name
    }
  }
}`

export const getInstanceData = (accountId) => {
  return gql`{
    actor {
      account(id: ${accountId}) {
        system: nrql(query: "FROM SystemSample SELECT  latest(timestamp) as 'timestamp', latest(providerAccountName) as 'providerAccountName', latest(coreCount) as 'numCpu', latest(memoryTotalBytes) as 'memTotalBytes', latest(operatingSystem) as 'operatingSystem', latest(ec2InstanceType) as 'ec2InstanceType', max(cpuPercent) as 'maxCpuPercent', max(memoryUsedBytes/memoryTotalBytes)*100 as 'maxMemoryPercent', latest(instanceType) as 'instanceType', latest(ec2InstanceType) as 'ec2InstanceType', latest(ec2InstanceId) as 'ec2InstanceId' FACET hostname, apmApplicationNames, entityGuid, awsRegion WHERE coreCount is not null and (instanceType is not null OR ec2InstanceType is not null) limit 2000 since 1 week ago", timeout: 30000) {
          results
        }
        network: nrql(query: "FROM NetworkSample SELECT latest(timestamp) as 'timestamp', max(receiveBytesPerSecond) as 'receiveBytesPerSecond', max(transmitBytesPerSecond) as 'transmitBytesPerSecond' FACET hostname, entityGuid, awsRegion, instanceType WHERE (instanceType is not null OR ec2InstanceType is not null) limit 2000 since 1 week ago", timeout: 30000) {
          results
        }
      }
    }
  }`
}

export const makeId = (length) => {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i=0; i<length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
} 