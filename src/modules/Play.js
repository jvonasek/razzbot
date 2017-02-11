let AbstractCommand = require('../core/AbstractCommand');
let Youtube = require('../core/Youtube');

const yt = new Youtube;

module.exports = class Play extends AbstractCommand {

  constructor() {
    super();
  }


  /**
   * Executes command for given message.
   *
   * @param      {object}  message
   */
  exec(message, subcommand) {
    super.exec(message);

    if (subcommand) {
      this.processSubcommand(subcommand);
    } else {
      let args = this.getArgs();
      this.startPlaying(args._[1]);
    }

  }


  /**
   * Joins voice channel if available.
   * Stars playing passed youtube url.
   *
   * @param      {string}  youtubeUrl
   */
  startPlaying(youtubeUrl) {
    if (this.voiceChannel) {
      // join voice channel
      this.voiceChannel.join().then(info => {

        // check if youtube url is valid
        if (youtubeUrl && yt.isYoutubeUrlValid(youtubeUrl)) {
          yt.playAudio(youtubeUrl, info);
        } else {
          this.channel.sendMessage('You must pass valid youtube url.');
        }

      });
    } else {
      this.channel.sendMessage('You are not in a voice channel.');
    }
  }


  /**
   * Prints the youtube queue in the channel.
   *
   * @param      {object}  queue
   */
  printQueue(queue) {
    let queueMessage = [
      'Current queue:'
    ];
    queue.forEach(item => {
      queueMessage.push(`${item.title} - ${item.author}`);
    });

    this.channel.sendMessage('`' + queueMessage.join('\n') + '`');

  }


  /**
   * Processes subcommands.
   *
   * @param      {string}  subcommand
   */
  processSubcommand(subcommand) {
    switch(subcommand) {
      case '!skip':
        yt.skip();
        break;
      case '!queue':
        this.printQueue(yt.getQueue());
        break;
    }
  }

}