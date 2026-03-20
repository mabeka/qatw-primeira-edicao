pipeline {
    agent {
        docker {
            image 'mabeka/playwright-java:1.58.2'
            args '--network qatw-primeira-edicao_skynet'
        }
    }

    stages {

        stage('Deps') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Tests') {
            steps {
                script {
                    catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                        sh 'npx playwright test'
                    }
                }
            }
        }

        stage('Allure Report') {
            steps {
                allure includeProperties: false,
                       jdk: '',
                       results: [[path: 'allure-results']]
            }
        }
    }
}