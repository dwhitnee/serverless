"server" functions to upload to the cloud to run in AWS Lambda
====

Requires local AWS credentials for [serverless-admin] in ~/.aws/credentials
<code>

    # Install serverless globally
    npm install serverless -g

    # Login to your Serverless account
    serverless login

    # Create a serverless function
    serverless create --template hello-world

    # Deploy to AWS
    # edit ~/.aws/credentials with [serverless-admin] keys
    export AWS_PROFILE="serverless-admin"
    export AWS_REGION=us-west-2
    serverless deploy    # --aws-profile serverless-admin

    # Function deployed! Trigger with live url
    http://xyz.amazonaws.com/hello-world

    # run functions locally
    serverless invoke local -f helloWorld

</code>
