# Start
```
npm run dev
```

# build
```
npm run build
```

# start server
```
pm2 start pm2.json
```

# start worker
```
pm2 start pm2.worker.json
```

# create entity
```
npm run typeorm migration:generate -- -n jp
```

# Run Migration
```
npm run typeorm migration:run
```