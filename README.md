## Troubleshooting

### `com.almworks.sqlite4java.SQLiteException: [14] unable to open database file`

[Change ownership][1] for the docker folder in the root of the project.

```
sudo chown $USER docker -R
chmod 775 -R docker
```

[1]: https://stackoverflow.com/questions/45850688/unable-to-open-local-dynamodb-database-file-after-power-outage
