#### Start
```
npm run dev
```

#### build
```
npm run build
```

#### start server
```
pm2 start pm2.json
```

#### start worker
```
pm2 start pm2.worker.json
```

#### create entity
you can add you own initials by replacing jp
```
npm run typeorm migration:generate -- -n jp
```

#### Run Migration
```
npm run typeorm migration:run
```

Answers to Bonus Questions:
### Rate Limiting:
Can be implemented using following approaches:
* Reliable but slower: query bulk_action table with accountId and calculate limit consumed so far with the help of (last_chunk_id x Batch Size)
* Fast but less reliable: store chunk_processed_so_far count in redis and calculate rate limit from there

### De-Duplication:
Deduplication can be handled at two levels. 1. Database, 2. Row Level
1. Database Level duplication is already managed using Unique Indexing on email column.
2. Row Level:
    * For each batch being executed, we can first filter out entries with unique email ids(last one wins strategy)
    * Further we can call database with these email ids to identify which one already exists and optimize our upsert strategy
    * may be we can opt for skipping entries with pre existing email in database(currently we are updating the fields for it)

### Scheduling:
Can be implemented using the following methods:
* Low volume CRON jobs: Linux based on server scheduling with task details in db. Hard to configure but cost efficient
  * create a bulk action processor for CRON jobs
* For High volume CRON jobs:
  * open source libraries: node-cron, node-schedule, Bull etc.
  * cloud services like Amazon EventBridge Scheduler, GCP/Firebase schedule function
