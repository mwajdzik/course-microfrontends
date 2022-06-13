### Microfrontends

divide a monolithic app into multiple, smaller apps
each smaller app is responsible for a distinct feature of the product

### Build time integration

publish different projects as npm packages
change container's dependencies
build and deploy app

	+ easy to setup and understand
	
	- container has to be rereployed everytime any of the projects changed
	- tempting to tightly couple the container and projects

### Run time integration

each project deployed separately
implemented with Webpack Module Federation

	+ each project deployed independently
	+ many versions of the same projects can be deployed and the container decides which to use
	+ most flexible and performant solution

	- tooling and setup much more complicated 

### products

npm install webpack@5.68.0 webpack-cli@4.9.2 webpack-dev-server@4.7.4 faker@5.1.0 html-webpack-plugin@5.5.0

### container

npm install webpack@5.68.0 webpack-cli@4.9.2 webpack-dev-server@4.7.4 html-webpack-plugin@5.5.0 nodemon

### Output Files

- normal bundling process
    - main.js

- module federation plugin
    - remoteEntry.js - contains a list of files that are available from this project + directions on how to load them
    - src_index.js
    - faker.js

### Linkage

- container/src/bootstrap.js
  ```import 'productsApp/ProductsIndex';```

- container/webpack.config.js
  ```remotes { productsApp: 'myproducts@http://localhost:8081/remoteEntry.js' }```

- products/webpack.config.js
  ```name: 'myproducts', filename: 'remoteEntry.js', exposes: { './ProductsIndex': './src/index' }```

### Shared libraries (the same version)

- shared: ['faker']
- package.json version is checked (^ = only major number must match)
- shared: { faker: { singleton: true }}  - load only one version no matter what (eg. for React)
