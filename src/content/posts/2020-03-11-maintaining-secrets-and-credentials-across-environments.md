---
title: "Maintaining secrets and credentials across environments"
date: 2020-03-11
slug: maintaining-secrets-and-credentials-across-environments
excerpt: "At Sequoia.com, we are building an Enterprise B2B SaaS product for providing health Insurance, HR Benefits & Payroll processing. We are…"
tags: [imported]
draft: true
source: medium
canonical_url: https://medium.com/@intrepidkarthi/maintaining-secrets-and-credentials-across-environments-270f5733530f
---

### Maintaining secrets and credentials across environments

At Sequoia.com, we are building an Enterprise B2B SaaS product for providing health Insurance, HR Benefits & Payroll processing. We are working with almost all the top hyper growth companies from across the world crossing over 1000+ customers.

![](https://cdn-images-1.medium.com/max/800/1*RvjS8OWcq2Q_6wwd4QgMIQ.png)As our team size is growing it became hectic for our DevOps team and engineering teams to manage all the secrets and credentials. As a HIPAA and SOC2 complaint organisation, we were exploring options to move all the credentials to a vault.

AWS Systems Manager Parameter Store comes in handy as the solution that we were looking for. Also this is easier for us since we run on top of AWS infrastructure. With in Parameter Store, you can store plain text as well as encrypted text and also DevOps team have better control in managing the key-value pairs across multiple environments through IAM policies.

For example, developers will have access to describe the parameters.

IAM Policy to describe AWS Param store valuesSimilarly, DBA can define more actions in the policies.

We have five different environments(Development, Staging, UAT, Pre-production, Production) inside our infrastructure. All the developers have access until development and staging environments. Rest of the environments are controlled by DevOps team members.

AWS parameter store approach was working good then we faced an issue with our changes going to 3 environments on a regular basis with more team members are pushing changes. We develop on Micro-services architecture where Golang and node.js remains our predominant languages to write the backend. Developers create new parameter store values based on the requirement on the Development and Staging environments and the same will be created in other environments(UAT, Pre-Production & Production) by the DevOps team members.

We store a lot of passwords, access keys, database credentials and a few strings which changes across environments. The main problem we were facing, since we have a lot of developers working on development environment, we will have multiple changes being pushed into staging environment based on the completion.

From there, we will have tagged changes goes into UAT environment and then to Pre-production and Production. At any point of time, all these environments will be in a different state. We use Jira and Confluence to track the development progress. On a daily basis, developers will add new AWS param store values into the Development environment. Then the same will be recreated into Staging environment. With this approach developers miss to inform other team members which will end up with issues in our build process. And sometimes we release hot fix where we create these param store values in Pre-production and Production but not in the other lower environments.

To keep the system intact across the environments, we have decided to write a script to check the param store keys between environments in our Jenkins pipeline.

![](https://cdn-images-1.medium.com/max/800/1*hI8OiRrXOiHjT9m2jNy4GA.png)SSM Params check in Jenkins pipelineFor example, if a developer pushing code changes into the staging environment, we will do the param store check between both development and staging environments.

The snippet checks all the AWS SSM parameter store values between the two environments and prints out what is missing. This will pause the deployment process.

![](https://cdn-images-1.medium.com/max/800/1*b_N7_sxlvQbVF-05NoepCA.png)Jenkins pipeline check for AWS SSM ParametersWith this, we are now able to properly maintain all the secrets in the right manner securely. We do follow a lot of practices in our development cycle and pick the approach which is correct and also which fits our need.

![](https://cdn-images-1.medium.com/max/800/1*egAn2rh5yxks2GXcpd5StQ.png)And yes, there are many ways to solve this problem. If there is a better way to solve this problem, do let us know.
