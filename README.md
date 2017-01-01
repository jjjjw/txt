Running Go tests

```
go test ./api
```

Generating Go protobuf

```
protoc --go_out=. models/*.proto
```

Generating JS protobuf

```
protoc --proto_path=models --js_out=import_style=commonjs,binary:fe/models models/models.proto
```
