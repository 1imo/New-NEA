import requests
import argparse
import concurrent.futures
from queue import Queue
import threading
import re
import tldextract

class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

    def dfs(self, level=0, prefix="", is_last=True):
        if self is None:
            return
        if level == 0:
            print(self.data)
        else:
            print(prefix + "+-- " + self.data)
        if self.left:
            self.left.dfs(level + 1, prefix + ("    " if is_last else "|   "), False)
        if self.right:
            self.right.dfs(level + 1, prefix + ("    " if is_last else "|   "), True)

    @classmethod
    def build_tree(self, root_url, depth):
        root = Node(root_url)
        visited = set()
        with concurrent.futures.ThreadPoolExecutor() as executor:
            self.build_tree_recursive(root, depth, visited, executor)
        return root

    @staticmethod
    def build_tree_recursive(node, depth, visited, executor):
        if depth == 0 or node.data in visited:
            return
        visited.add(node.data)
        try:
            queue = req(node.data)
            futures = []
            for url in queue:
                if url not in visited:
                    if node.left is None:
                        node.left = Node(url)
                        future = executor.submit(Node.build_tree_recursive, node.left, depth - 1, visited, executor)
                        futures.append(future)
                    elif node.right is None:
                        node.right = Node(url)
                        future = executor.submit(Node.build_tree_recursive, node.right, depth - 1, visited, executor)
                        futures.append(future)
                    else:
                        break
            concurrent.futures.wait(futures)
        except Exception as e:
            print(f"Error fetching URLs for {node.data}: {e}")

def bfs(url, depth):
    visited = set()
    queue = Queue()
    queue.put((url, 0, "", True))
    visited.add(url)

    while not queue.empty():
        current_url, current_depth, prefix, is_last = queue.get()
        if current_depth > depth:
            break

        if current_depth == 0:
            print(current_url)
        else:
            print(prefix + "+-- " + current_url)

        if current_depth < depth:
            try:
                urls = req(current_url)
                for i, new_url in enumerate(urls):
                    if new_url not in visited:
                        queue.put((new_url, current_depth + 1, prefix + ("    " if is_last else "|   "), i == len(urls) - 1))
                        visited.add(new_url)
                        path = new_url.split("://")[1].split("/")[0]
                        tld = tldextract.extract(path).suffix
                        path = path.split(tld)[0]
                        path = path.split(".")[len(path.split(".")) - 2]
                        
                        with open(path + ".txt", "a") as file:
                            file.write(new_url + "\n")
            except Exception as e:
                print(f"Error fetching URL: {current_url} - {e}")

def req(url):
    try:
        response = requests.get(url.strip())
        content = str(response.content)
        urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', content)
        
        return urls
    except Exception as e:
        print(f"Error fetching URL: {url} - {e}")
        return []

def main():
    parser = argparse.ArgumentParser(description="Web Crawler")
    parser.add_argument("--url", help="Root URL to start crawling from")
    parser.add_argument("--depth", help="URL depth to crawl")
    args = parser.parse_args()

    root_url = args.url
    depth = int(args.depth)

    print("DFS Traversal:")
    root = Node.build_tree(root_url, depth)
    root.dfs()

    print("\nBFS Traversal:")
    bfs(root_url, depth)

main()