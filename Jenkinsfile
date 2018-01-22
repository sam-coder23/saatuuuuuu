pipeline {
    agent any
    stages {
        stage('Build'){
            steps {
                sh 'npm install'
            }
        }
        stage('Test'){
            steps {
                //TODO - Remove the bypass on test failure
                sh 'npm run test:headless ||  true'
            }
        }
        stage('Sonar-Reporting'){
            when {
                branch 'develop'
            }
            steps {
                sh 'npm run sonar:publish'
            }
        }
    }
    post {
        always {
            script {
                currentBuild.result = currentBuild.result ?: 'SUCCESS'
                 step([$class: 'StashNotifier', ignoreUnverifiedSSLPeer: true])
            }
        }
    }
}
