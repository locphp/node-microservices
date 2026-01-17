pipeline {
  agent any

  tools {
    nodejs 'node18'
  }

  environment {
    SONAR_SCANNER_HOME = tool 'sonar-scanner'
    IMAGE_TAG = "${BUILD_NUMBER}"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'cd user-service && npm install'
        sh 'cd product-service && npm install'
      }
    }

    stage('Test') {
      steps {
        sh 'cd user-service && npm test'
        sh 'cd product-service && npm test'
      }
    }

    stage('SonarQube Scan') {
      steps {
        withSonarQubeEnv('SonarQube') {
          sh '${SONAR_SCANNER_HOME}/bin/sonar-scanner'
        }
      }
    }

    stage('Build, Scan & Push Docker Images') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo "Login DockerHub"
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

            echo "Build images"
            docker build -t $DOCKER_USER/user-service:$IMAGE_TAG ./user-service
            docker build -t $DOCKER_USER/product-service:$IMAGE_TAG ./product-service

            echo "Security scan (Trivy)"
            trivy image --exit-code 0 $DOCKER_USER/user-service:$IMAGE_TAG
            trivy image --exit-code 0 $DOCKER_USER/product-service:$IMAGE_TAG

            echo "Push images"
            docker push $DOCKER_USER/user-service:$IMAGE_TAG
            docker push $DOCKER_USER/product-service:$IMAGE_TAG
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          kubectl apply -f k8s/
        '''
      }
    }
  }
}
