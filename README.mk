"server" functions to upload to the cloud to run in AWS Lambda
====

<code>

    # Install serverless globally
    npm install serverless -g

    # Login to your Serverless account
    serverless login

    # Create a serverless function
    serverless create --template hello-world

    # Deploy to AWS
    export AWS_PROFILE="serverless-admin"
    export AWS_REGION=us-west-2
    serverless deploy    # --aws-profile serverless-admin

    # Function deployed! Trigger with live url
    http://xyz.amazonaws.com/hello-world

    # run functions locally
    serverless invoke local -f helloWorld

</code>
