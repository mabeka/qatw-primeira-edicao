pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Debug Workspace') {
            steps {
                sh '''
                    echo "===== WORKSPACE ====="
                    pwd
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
                        -v ${WORKSPACE}:/app \
                        -w /app \
                        mabeka/playwright-java:1.58.2 \
                        sh -c "
                            echo '===== DEBUG /app =====' &&
                            ls -la /app &&

                            echo '===== VALIDANDO PACKAGE.JSON =====' &&
                            cat /app/package.json &&

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
    }
}