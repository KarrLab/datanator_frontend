# Contributing to the Datanator web application

We enthusiastically welcome contributions to the Datanator web application!

## Coordinating contributions

Before getting started, please contact the lead developers at [info@karrlab.org](mailto:info@karrlab.org) to coordinate your planned contributions with other ongoing efforts. Please also use GitHub issues to announce your plans to the community so that other developers can provide input into your plans and coordinate their own work. As the development community grows, we will institute additional infrastructure as needed such as a leadership committee and regular online meetings.

## Repository organization

The Datanator web application follows standard JavaScript and NPM conventions:

* `src/`: source code
* `src/__tests__/`: unit tests (Jest)
* `integration-tests/tests`: integration tests (Cypress)
* `package.json`: package metadata

## Coding convention

Datanator follows standard JavaScript style conventions:

* Class names: `UpperCamelCase`
* Function names: `lowerCamelCase`
* Variable names: `lowerCamelCase`

## Testing

We strive to have complete test coverage of Datanator. As such, all contributions to Datanator should be tested. The tests are located in the `src/__tests__` and `integration-tests/tests` directories. The tests can be executed by running `npm run test-unit` and `npm run test-integration-run`.

Upon each push to GitHub, GitHub will trigger CircleCI to execute all of the tests.

## Submitting changes

Please use GitHub pull requests to submit changes. Each request should include a brief description of the new and/or modified features.

## Releasing and deploying new versions

Contact [info@karrlab.org](mailto:info@karrlab.org) to request release and deployment of new changes. 
