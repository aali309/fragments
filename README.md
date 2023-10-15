# fragments

This is is the tracking repo of all my assignments and labs for DPS955NSA course (Cloud Computing)

# Check for errors

21. Run `eslint` to check if there are possible errors to fix:

```sh
npm run lint
```

# Server

Test that the server can be started manually:

```sh
node src/server.js
```

url: `<http://localhost:8080>`

Server can be started using three methods:

```sh
npm start -> {Normal Startup}
npm run dev -> {Dev Startup}
npm run debug -> {Debug Startup}
```

# Containers

## Building

- docker build -t fragments:latest .

## Running

- docker run --rm --name fragments --env-file env.jest -p 8080:8080 fragments:latest
- docker run --rm --name fragments --env-file env.jest -e LOG_LEVEL=debug -p 8080:8080 fragments:latest (with debug options)

## Stopping a container

- docker ps # get the id of the running container
- docker stop <container> # kill it (gracefully)
- ctrl+c does not work

## Detaching a container

- we use -d flag
- docker run --rm --name fragments --env-file env.jest -e LOG_LEVEL=debug -p 8080:8080 -d fragments:latest
  - this will produce and `id` i.e 3e1e......
- Docker runs our container, and prints its `id`. We can use this `id` to manage and interact with it later. For example, to see its logs:
  - docker logs `3e1e6f1b9f86c30dc52115eb668a5cee34887f877271481e06b006e98ae761f3`
- we can also have Docker follow the logs:
  - docker logs -f `3e1e6f1b9f86c30dc52115eb668a5cee34887f877271481e06b006e98ae761f3`

# ec2 useful commands

## connect to your instance

- ssh -i authorized_keys `[ec2-user@ec2-54-211-8-143.compute-1.amazonaws.com]` (this is your instance DNS, it changes all the time you stop and start and ec2 instance)

## Install and Run the fragments Microservice on EC2

- we have to package and copy our source code to the instance
  `cd fragments
npm pack
...
fragments-0.0.1.tgz
`
- Copy your `fragments-0.0.1.tgz` tarball to your EC2 instance.
- ` scp -i authorized_keys fragments-0.0.1.tgz [ec2-54-211-8-143.compute-1.amazonaws.com]:` the [is your DNS instance]
- On your EC2 instance, confirm that your tarball is there:
  `
cd ~
ls`
  `fragments-0.0.1.tgz`
- Extract your project's source code from your tarball
  - `tar -xvzf fragments-0.0.1.tgz`
- `ls
fragments-0.0.1.tgz  package`
- `cd package
ls
env.jest  jest.config.js  package.json  README.md  src  tests`
  -Install your project's dependencies using `npm install`.

- copy the `.env`

  - `scp -i authorized_keys .env [ec2-user@ec2-54-211-8-143.compute-1.amazonaws.com]:package/.env` -> the [is your DNS instance]

- Run your server using `npm start`
- Try accessing your microservice running on your EC2 instance in several ways - Using your web browser. In the address bar, put the IPv4 DNS of your EC2 instance along with `:8080`

- Use the AWS CLI to [start & stop your instance]
- `aws ec2 start-instances --instance-ids {instance-id}`
- `aws ec2 stop-instances --instance-ids {instance-id}`

## ec2 build-image & run container

- we need sudo command with terminal i.e `sudo`
- check status `status docker.service` if running or not i.e ` Active: inactive (dead)`
- sudo docker build -t fragments:latest .
- `sudo service docker start` start docker
- running a container `sudo docker run --rm --name fragments --env-file env.jest -e LOG_LEVEL=debug -p 8080:8080 -d fragments:latest` just like above steps it will produce and ID that will be used to manage it.
- using curl `sudo curl ec2-35-174-167-51.compute-1.amazonaws.com:8080`
- getting docker logs `sudo docker logs -f 41b9e506eaeca6a432675ef7b29c3922b50a62da8eea23c0185cb9a870073f08` the 41b is the id produced on line 103 after running in a detached mode
- To see a list of all Docker processes running `sudo docker ps`
- To kill `sudo docker kill <CONTAINER ID>`
