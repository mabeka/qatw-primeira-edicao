pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "mabeka/playwright-java:1.58.2"
        NETWORK = "qatw-primeira-edicao_default"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Debug') {
            steps {
                sh '''
                    echo "Diretório atual:"
                    pwd
                    echo "Arquivos:"
                    ls -la
                '''
            }
        }

        stage('Run Tests (Docker)') {
            steps {
                script {
                    catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                        sh """
                        docker run --rm \
                          --network ${NETWORK} \
                          -v "\$(pwd):/app" \
                          -w /app \
                          ${DOCKER_IMAGE} \
                          sh -c "
                            echo 'Node version:' && node -v &&
                            echo 'NPM version:' && npm -v &&
                            npm install &&
                            npx playwright install &&
                            npx playwright test
                          "
                        """
                    }
                }
            }
        }

        stage('Publish Allure Results') {
            steps {
                sh '''
                    echo "Publicando resultados do Allure..."
                    mkdir -p allure-results
                    ls -la allure-results || true
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'allure-results/**', fingerprint: true
            echo 'Pipeline finalizado.'
        }

        success {
            echo 'Build SUCCESS'
        }

        failure {
            echo 'Build FAILURE'
        }
    }
}