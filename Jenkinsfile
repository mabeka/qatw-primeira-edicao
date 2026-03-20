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

        stage('Debug Workspace') {
            steps {
                sh '''
                    echo "Diretório atual:"
                    pwd

                    echo "Listando arquivos do workspace:"
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
                          -v ${WORKSPACE}:/app \
                          -w /app \
                          ${DOCKER_IMAGE} \
                          sh -c "
                            echo '===== DEBUG /app =====' &&
                            ls -la &&
                            
                            echo '===== NODE =====' &&
                            node -v &&

                            echo '===== NPM =====' &&
                            npm -v &&

                            echo '===== INSTALL =====' &&
                            npm install &&

                            echo '===== INSTALL PLAYWRIGHT =====' &&
                            npx playwright install &&

                            echo '===== RUN TESTS =====' &&
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

                    echo "Conteúdo do allure-results:"
                    ls -la allure-results || true
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'allure-results/**', fingerprint: true
            echo 'Pipeline finalizada.'
        }

        success {
            echo 'Build SUCCESS'
        }

        failure {
            echo 'Build FAILURE'
        }
    }
}