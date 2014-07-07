# API Gateway

## Getting Started
1. Install JDK 8
http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html

2. Install Maven 3 
http://maven.apache.org/download.cgi 

3. Verify Maven uses Java 8
  ```
$ mvn -version
  ```
  ```
Apache Maven 3.0.4 (r1232337; 2012-01-17 03:44:56-0500)
Maven home: /Users/will.riker/springsource/apache-maven-3.0.4
Java version: 1.8.0_20-ea, vendor: Oracle Corporation
Java home: /Library/Java/JavaVirtualMachines/jdk1.8.0_20.jdk/Contents/Home/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "mac os x", version: "10.9.2", arch: "x86_64", family: "mac"
  ```

4. Install the Cloud Foundry CLI (if deploying to Cloud Foundry)
https://github.com/cloudfoundry/cli

4. In your workspace folder, create a project, either by cloning this repo, or by generating it from our Maven archetypes:
  ```
$ mvn archetype:generate -DarchetypeCatalog=https://maven.xtremelabs.com/artifactory/repo/ 
  ```

5. Run it! cd to the project folder, then:
  ``` 
$ mvn spring-boot:run
  ```
  By default, your server will run on port 8080 in the root context (eg http://localhost:8080/). The base path for all your API enpoints defaults to http://localhost:8080/api/, and each sample will respond to that url with a description of each endpoint it provides.

6. Iterate! You can use your favourite text editor or IDE. You can change src/main/resources/app.js (the main application file), add your own .js modules, change anything loaded using require(), and modify static files in src/main/resources/public, without restarting the server.

7. Deploy!

  * You can package your application as a runnable jar that runs an embedded Jetty server
    
    ```
$ mvn package
$ java -jar target/your-app-1.0-SNAPSHOT-runnable.jar
    ```
  * You can also package your application as a war file to run in any Java 8 enabled servlet container:
    
    ```
$ mvn war:war
    ```
  * To deploy to Cloud Foundry:
    
    ```
$ mvn package
$ cf push
    ```

## API docs
http://cfmobile.github.io/docs-apigateway/
