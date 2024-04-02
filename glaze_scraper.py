import requests
from bs4 import BeautifulSoup
import json

def fetch_glazes():
    print("Fetching glaze options...")
    headers = {'X-Requested-With': 'XMLHttpRequest'}
    url = 'https://cors-anywhere.herokuapp.com/https://amaco.com/resources/layering'
    print(f"--- {url} ---")
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    options = soup.select('div.search-glazes option')
    glazes = [option.text.strip() for option in options if option.text.strip() != "Select Top Glaze" and option.text.strip() != "Select Bottom Glaze"]
    return list(set(glazes[:10]))

def fetch_combination_page(url, headers):
    print(f"--- Fetching combinations from: {url} ---")
    response = requests.get('https://cors-anywhere.herokuapp.com/' + url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    combinations = []
    
    for card in soup.select('.card-combination.title-link-parent'):
        image_element = card.select_one('.card-combination__image img')
        detail_element = card.select_one('.title-link.text-reset')
        if image_element and detail_element:
            image_url = image_element.get('data-src', image_element.get('src'))  # Some images might not use data-src
            detail_url = detail_element['href']
            combinations.append({"url": detail_url, "imageUrl": image_url})
    
    return combinations, soup

def fetch_combinations(glaze):
    combinations = {}
    glaze_id = glaze.replace(" ", "-").lower()
    headers = {'X-Requested-With': 'XMLHttpRequest'}
    
    for position in ['top', 'bottom']:
        page = 1
        while True:
            base_url = f'https://amaco.com/resources/layering?{position}={glaze_id}&page={page}'
            next_page_combinations, soup = fetch_combination_page(base_url, headers)

            for combo in next_page_combinations:
                ids = extract_glaze_ids(combo['url'])
                sorted_ids = sorted(ids)
                key = f"{sorted_ids[0]}/{sorted_ids[1]}"
                if key not in combinations:
                    combinations[key] = []
                combinations[key].append(combo)

            pagination_links = soup.select('.page-link')
            if not any(f'page={page + 1}' in link.get('href', '') for link in pagination_links):
                break  # Exit loop if no next page is found
            page += 1

    return combinations

def extract_glaze_ids(url):
    parts = url.split('/')
    ids = parts[-1].split('-over-')
    return ids[0], ids[1]

def main():
    glazes = fetch_glazes()
    print(f"\nGlazes: {glazes}")

    combinations_dict = {}

    with open('glaze_combinations.json', 'r') as file:
        data = json.load(file)
        combinations_dict = data

    for glaze in glazes:
        print(f"\nFetching combinations for {glaze}...")
        glaze_combinations = fetch_combinations(glaze)
        for key, value in glaze_combinations.items():
            if key not in combinations_dict:
                combinations_dict[key] = value
            else:
                combinations_dict[key].extend(value)

    cleaned_data = {}
    for key, combinations in combinations_dict.items():
        unique_combinations = []
        seen = set()
        for combo in combinations:
            identifier = (combo['url'], combo['imageUrl'])
            if identifier not in seen:
                seen.add(identifier)
                unique_combinations.append(combo)
        cleaned_data[key] = unique_combinations

    print("\nFinal combination data:", json.dumps(cleaned_data, indent=4))
    with open('glaze_combinations.json', 'w') as f:
        json.dump(cleaned_data, f, indent=4)

if __name__ == "__main__":
    main()
