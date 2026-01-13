pipeline {
  agent any

  tools {
    nodejs 'node18'
  }

  environment {
    SONAR_SCANNER_HOME = tool 'sonar-scanner'
    DOCKER_USER = 'your_dockerhub_username'
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

    stage('Build Docker Images') {
      steps {
        sh """
          docker build -t $DOCKER_USER/user-service:$IMAGE_TAG ./user-service
          docker build -t $DOCKER_USER/product-service:$IMAGE_TAG ./product-service
        """
      }
    }
    stage('Security Scan') {
      steps {
        sh """
          trivy image $DOCKER_USER/user-service:$IMAGE_TAG
          trivy image $DOCKER_USER/product-service:$IMAGE_TAG
        """
      }
    }
    stage('Push Docker Images') {
      steps {
        sh """
          docker push $DOCKER_USER/user-service:$IMAGE_TAG
          docker push $DOCKER_USER/product-service:$IMAGE_TAG
        """
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh """
          kubectl apply -f k8s/
        """
      }
    }
  }
}
