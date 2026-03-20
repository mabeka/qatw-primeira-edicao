pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "mabeka/playwright-java:1.58.2"
        NETWORK = "qatw-primeira-edicao_default"
    }

    stages {

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
                        sh '''
                        docker run --rm \
                          --network ${NETWORK} \
                          -v "$PWD:/app" \
                          -w /app \
                          ${DOCKER_IMAGE} \
                          sh -c "npm ci && npx playwright test"
                        '''
                    }
                }
            }
        }

        stage('Publish Allure Results') {
            steps {
                sh '''
                echo "Publicando resultados do Allure..."
                mkdir -p allure-results || true
                ls -la allure-results || true
                '''
            }
        }
    }

    post {
        always {
            echo "Pipeline finalizada."

            archiveArtifacts artifacts: '**/test-results/**', allowEmptyArchive: true
            archiveArtifacts artifacts: '**/allure-results/**', allowEmptyArchive: true
        }

        success {
            echo "Build SUCCESS"
        }

        failure {
            echo "Build FAILURE"
        }
    }
}