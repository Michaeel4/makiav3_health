module.exports = {
    apps : [{
        name: 'health',
        script: 'npm run prod',
        cwd    : "/var/www/health-node/",
        watch: true
    }],
};

