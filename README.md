# SLO HACKS 2019 

Best AI/ML Hack

1st Place in iTradeNetwork’s anomaly detection challenge

Top 5 Overall Hacks

## Inspiration

iTradeNetwork's Anomaly Detection Challenge!

## What it does

The iTradeNetwork challenge is to develop a system to detect anomalies within their provided dataset of perishable good supply chain invoices. The dataset is almost 500,000 entries, so our solution leverages unsupervised ML to tackle the issue! The challenge does not provide any examples of anomalous data, so we were free to create our own metric. To solve this problem, our system assigns all data samples an anomaly score, allowing us to provide the end user with a stream of potential anomalies, prioritized by likelihood to be anomalous.

## How we built it

After extensive data cleaning, we trained an autoencoder neural network to develop embeddings for the data samples. From there, we used the Local Outlier Factor algorithm to detect outliers among the embedded samples within the latent space. The samples that corrspond to those embeddings can then be examined as potential anomalies that rule-sets are likely to miss.

We provide the service to the end-user through an easy-to-use web application. Built with React/Node.js/Flask, the user can easily explore the potential anomalies.

## Challenges we ran into

At the start of the hackathon, our team composed of four group members. However, as time went on, the team size fell to two. With the same goal in mind, we worked with machine learning algorithms that neither of us had much experience with. Additionally, we were working with quite dirty data and utilizing web frameworks that we have minimal experience in.

## Accomplishments that we're proud of

We are extremely happy about the systems we developed to clean and analyze the data! We fought through the struggles of losing teammates and learning new packages/frameworks and were still able to reach most of our goals!


## Running the web app locally

1. npm install
2. pip3 install -r requirements.txt
2. npm run dev (or "npm run start" in a different terminal to have the changes incorporate live
4. python3 server.py
5. Go to http://localhost:3000
6. Use 'CTRL+SHIFT+R' to override the cache and reload the page
