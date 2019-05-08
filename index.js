#!/usr/bin/env node

/**
 *  该总入口只完成一部分通用操作，以及分发各种类型的创建任务给特定的脚手架程序
 *  By Roubo
 */
const fs = require('fs');
const program = require('commander');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const native = require('./native/index');

program.version('1.0.0', '-v, --version')
  .command('init <name>')
  .action((name) => {
    if(!fs.existsSync(name)) {
      inquirer.prompt([
        {
          name: 'description',
          message: '描述你的项目: '
        },
        {
          name: 'author',
          message: '作者名: '
        },
        {
          name: 'topType',
          message: '需要初始化的应用类型，目前支持：h5/native/pyApp/weApp/flutter/react-native: '
        }
      ]).then((answers) => {
        // 保存基本信息 ----------------------------------------------------------------------
        const rouboFile = `${name}/roubo.json`;
        const spinner01 = ora('为你写入配置信息 ...');
        spinner01.start();
        fs.mkdirSync(name)
        const meta = {
          name,
          description: answers.description,
          author: answers.author
        };
        if(!fs.existsSync(rouboFile)) {
          fs.writeFileSync(rouboFile, JSON.stringify(meta, null, 2));
        } else {
          const content = fs.readFileSync(rouboFile).toString();
          const result = handlebars.compile(content)(meta);
          fs.writeFileSync(rouboFile, result);
        }
        spinner01.succeed();

        // 开始分发具体类型 ------------------------------------------------------------------
        const spinner02 = ora('为你切换到项目配置：' + answers.topType);
        spinner02.start();
        if ( ['h5','native','pyApp','weApp','flutter','react-native'].indexOf(answers.topType)  === -1 ) {
          spinner02.fail();
          console.log(symbols.error, chalk.red('不支持配置: ' + answers.topType))
        } else {
          spinner02.succeed();
          switch (answers.topType) {
            case 'native':
              native.entry(name, answers.description, answers.author);
              break;
            case 'h5':
              break;
            case 'pyApp':
              break;
            case 'weApp':
              break;
            case 'react-native':
              break;
            case 'flutter':
              break;
            default:
              break;
          }
        }
      })
    } else {
      console.log(symbols.error, chalk.red('项目已存在，未防止被覆盖，停止初始化工作 ！'))
    }
  });

  program.parse(process.argv);
