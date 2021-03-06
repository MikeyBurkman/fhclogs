# fhclogs
Utility for easier viewing of RHMAP logs

`fhclogs tail service1 prod`

## Set UP

### RC files
First, you need to create a `.fhclogsrc` file somewhere, ideally in your home directory. 

This file makes it so you don't have to memorize service IDs. It also allows this tool to have autocompletion.

(The executable follows standard rc file behavior, searching in all directories from the current one, to the root directory, for config files.)

An example rc file:
```json
{
    "apps": {
        "app1": "app1AppId",
        "service1": "service1ServiceID"
    },
    "envs": [
        "dev",
        "test",
        "pre-prod",
        "prod"
    ],
    "pipeTo": "bunyan -L -o short --color"
}
```
The `apps` object is a mapping of app/service names (these can be literally whatever you want) to their service IDs. 

(These IDs are what you would normally use when calling `fhc app logs --app=XXXXX`.)

The `envs` array contains the names of the environments for your application.

The `pipeTo` string is optional, and is not supported on Windows. The output from log files will be piped to this command.

### Installing and Initializing `fhc`
1. You must install `fhc` from npm first:
`npm i -g fh-fhc@latest-2`

2. Targeting your domain in fhc
`fhc target your-domain.feedhenry.com`

3. Log in using your credentials
`fhc login`
(It will ask you for your credentials)

### Installing `fhclogs`
`npm i -g MikeyBurkman/fhclogs`

### Setting up autocompletion (optional -- Linux/OSX only)
`fhclogs completion >> ~./bashrc`

(If on OSX, you might need to append to ~/.profile)

Note that you'll have to open a new terminal for autocompletion to start working.

## Running the Tool
`fhclogs`

This will output the help, listing the available commands
```
Commands:
  apps                               List all apps found in the config file
  get <appName> <env> <logName>      Get a log file
  latest <appName> <env> [index]     Gets the latest stdout log file. Optional
                                     index is a 1-based integer used to get
                                     previous files
  latestErr <appName> <env> [index]  Get the latest stderr log file. Optional
                                     index is a 1-based integer used to get
                                     previous files
  tail <appName> <env>               Tail the current log file
  completion                         generate bash completion script

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

For example, tailing the logs for an app:

`fhclogs tail service1 test`

To get the latest error logs for an app:

`fhclogs latestErr app1 prod`

(You can then pipe the output of these to, for instance, Bunyan, or grep)
