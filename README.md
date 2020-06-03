
# It is a reply tracker service for different clients GMail, Amazonses, SMTP, Office365
## Built in NodeJs (ES6)


## To try this sample

> Note these instructions are for running the sample on your local machine
1) Clone the repository

    ```bash
    git clone https://github.com/mubasher123/ReplyTrackerService.git
    ```

1) In a terminal, navigate to project directory

1) Install modules

    ```bash
    npm install
    ```

1) Add the env file, ask any of your teammate to tell that:

    ```bash
    HASH_SECRET=CompanySecret
    ```
    
1) Run your service at the command line:

    ```bash
    node replyJobs.js publish
    node replyProcessor.js replyProcessor
    ```