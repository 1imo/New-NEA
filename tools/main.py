from datetime import datetime
import requests
import argparse
import concurrent.futures
from queue import Queue
import threading
import re
import tldextract

counter = 0

def dfs(url, depth, visited=None, level=0, prefix=""):
    global counter
    counter+=1
    # Overwriting params
    if visited is None:
        visited = set()

    if level > depth or url in visited:
        # BASE CASE
        return

    visited.add(url)  # Mark URL as visited

    print(prefix + "+-- " + url)  # Print with indentation

    if level < depth:
        try:
            urls = req(url)  # Fetch URLs from the current URL
            for i, new_url in enumerate(urls): # index and value at ordinal of index
                if new_url not in visited:
                    # Recursively traverse the child URL
                    dfs(new_url, depth, visited, level + 1, prefix + ("    " if i == len(urls) - 1 else "|   "))
        except Exception as e:
            print(f"Error fetching URLs for {url}: {e}")

def bfs(url, depth):
    global counter
    counter+=1 # Include the root node in count

    visited = set()  # Set to keep track of visited URLs
    queue = Queue()  # Queue for BFS traversal
    queue.put((url, 0, ""))  # Add the root URL to the queue
    visited.add(url)  # Mark as visited

    while not queue.empty():
        current_url, current_depth, prefix = queue.get()  # Dequeue next URL from queue
        if current_depth > depth:
            # BASE CASE
            break

        print(prefix + "+-- " + current_url)  # Print with indentation

        if current_depth < depth:
            try:
                urls = req(current_url)  # Fetch URLs from the current URL
                for new_url in urls:
                    if new_url not in visited:
                        # Add the new URL to the queue
                        queue.put((new_url, current_depth + 1, prefix + "|   ")) # Enqueue new URL
                        counter+=1 # Increment the counter
                        visited.add(new_url)  # Mark the new URL as visited

                        # Get root domain
                        path = new_url.split("://")[1].split("/")[0]
                        tld = tldextract.extract(path).suffix
                        path = path.split(tld)[0]
                        path = path.split(".")[len(path.split(".")) - 2]
                        
                        with open(path + ".txt", "a") as file:
                            # Save the URL to a text file based on the domain
                            file.write(new_url + "\n")
            except Exception as e:
                print(f"Error fetching URL: {current_url} - {e}")

def req(url):
    # Make a request to the given URL and extract URLs from the response content
    try:
        response = requests.get(url.strip())  # Send a GET request to the URL
        content = str(response.content)  # Get the response content as a string
        # Extract URLs from the content using regex
        urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', content)
        
        return urls
    except Exception as e:
        print(f"Error fetching URL: {url} - {e}")
        return []

def main():
    global counter
    # Main function to parse command-line arguments and start the web crawler
    parser = argparse.ArgumentParser(description="Web Crawler")
    parser.add_argument("--url", help="Root URL to start crawling from")
    parser.add_argument("--depth", help="URL depth to crawl")
    args = parser.parse_args()

    root_url = args.url  # Get the root URL from command-line arguments
    depth = int(args.depth)  # Get the depth from command-line arguments

    ts = datetime.now()
    print("DFS Traversal:")
    dfs(root_url, depth)  # Perform DFS traversal and tree building
    print(f"DFS Traversal Time: {datetime.now() - ts}")
    print(counter)
    print("\n\n\n\n\n")

    counter = 0
    ts = datetime.now()
    print("\nBFS Traversal:")
    bfs(root_url, depth)  # Perform BFS traversal
    print(f"DFS Traversal Time: {datetime.now() - ts}")
    print(counter)

main()