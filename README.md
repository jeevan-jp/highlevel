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


# Faker script:
create a file faker.ts and run npx ts-node faker.ts;
This will create a test data file named users.csc in project root
```ts
import { faker } from "@faker-js/faker";
import fs from "fs";
import { logger } from "./logger/logger";

function createRandomUser() {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: "international" }),
  };
}

const users = faker.helpers.multiple(createRandomUser, {
  count: 10000000, // generate 1Cr users
});

let csvStr = "name,phone,email\n";
let count = 0;

for (const user of users) {
  user.phone = user.phone.slice(-10); // use last 10 digits of phone number
  csvStr += `${user.username},${user.phone},${user.email}\n`;
  count++;

  // write to a local file named "users.csv"
  if (count % 50000 === 0) {
    logger.info(count + " / 1000000");
    fs.appendFileSync("users.csv", csvStr);
    csvStr = ""; // reset csvStr after writing to file
  }
}

fs.appendFileSync("users.csv", csvStr);
```

### DB Benchmarking: Write Performance (2cores/8gb/100gb)

#### With Batching
```
BatchSize,Time
10,0.22s
100,2.22s
500,11s
1000,20.5s
```

#### Without Batching
```
ChunkSize,Time(seconds)
1000,25.9s
```


### DB Benchmarking: Write Performance (4cores/16gb/100gb)

#### With Batching
```
BatchSize,Time(seconds)
10, 0.2s
100, 2.2s
500, 9.5s
1000, 20.5s
```

#### Without Batching
```
ChunkSize,Time
1000, 23s
```
