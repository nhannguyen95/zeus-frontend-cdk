#!/bin/bash

aws cloudformation deploy --template-file templates/CloudFormationDeploymentRole.yml \
    --stack-name CloudFormationDeploymentRole \
    --capabilities CAPABILITY_NAMED_IAM \
    --profile zeus-beta \
    --parameter-overrides ToolsAccountId=${TOOLS_ACCOUNT_ID} KeyArn=${S3_KMS_KEY_ARN} Stage=Beta

aws cloudformation deploy --template-file templates/CodePipelineCrossAccountRole.yml \
    --stack-name CodePipelineCrossAccountRole \
    --capabilities CAPABILITY_NAMED_IAM \
    --profile zeus-beta \
    --parameter-overrides ToolsAccountId=${TOOLS_ACCOUNT_ID} KeyArn=${S3_KMS_KEY_ARN} Stage=Beta
