# NC News Seeding

- In order for the scripts in this repo to connect to the relevant database, two files will need creating in the main (top-level) directory:
    -'.env.development'
        - should contain the single line 'PGDATABASE=nc_news'
        - this allows the seeding scripts to connect to the development database by default when not run in a test context
    -'.env.test' - this file should contain the single line 'PGDATABASE=nc_news_test'
        - should contain the single line 'PGDATABASE=nc_news_test'
        - this allows the seeding scripts to connect to the test database by default when run in a test context

