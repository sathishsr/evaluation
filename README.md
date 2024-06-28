#!/bin/bash

# Define an array of repository names in the format "owner/repo"
repositories=(
    "owner1/repo1"
    "owner2/repo2"
    # Add more repositories as needed
)

# Define the date range
start_date="YYYY-MM-DD"
end_date="YYYY-MM-DD"

# Your GitHub username and personal access token
github_username="your_username"
github_token="your_personal_access_token"

# Initialize a counter for your total reviews
total_reviews=0

# Function to make authenticated requests to GitHub API
make_github_request() {
    url=$1
    response=$(curl -s -u "$github_username:$github_token" "$url")
    echo "$response"
}

# Convert date strings to seconds since epoch
start_date_sec=$(date -d "$start_date" +%s)
end_date_sec=$(date -d "$end_date" +%s)

# Loop through each repository
for repo in "${repositories[@]}"; do
    echo "Repository: $repo"
    
    # Fetch pull requests for the repository (paginated)
    page=1
    while :; do
        pulls=$(make_github_request "https://api.github.com/repos/$repo/pulls?state=all&per_page=100&page=$page")
        pull_count=$(echo "$pulls" | jq '. | length')
        
        if [ "$pull_count" -eq 0 ]; then
            break
        fi
        
        for row in $(echo "$pulls" | jq -r '.[] | @base64'); do
            _jq() {
                echo "$row" | base64 --decode | jq -r "$1"
            }
            
            pull_number=$(_jq '.number')
            
            # Fetch reviews for the pull request (paginated)
            review_page=1
            while :; do
                reviews=$(make_github_request "https://api.github.com/repos/$repo/pulls/$pull_number/reviews?per_page=100&page=$review_page")
                review_count=$(echo "$reviews" | jq '. | length')
                
                if [ "$review_count" -eq 0 ]; then
                    break
                fi
                
                for review_row in $(echo "$reviews" | jq -r '.[] | @base64'); do
                    _jq_review() {
                        echo "$review_row" | base64 --decode | jq -r "$1"
                    }
                    
                    review_date=$(_jq_review '.submitted_at')
                    review_author=$(_jq_review '.user.login')
                    
                    # Convert review date to seconds since epoch
                    review_date_sec=$(date -d "$review_date" +%s)
                    
                    # Check if the review is within the date range and by the user
                    if [ "$review_date_sec" -ge "$start_date_sec" ] && [ "$review_date_sec" -le "$end_date_sec" ] && [ "$review_author" == "$github_username" ]; then
                        total_reviews=$((total_reviews + 1))
                        echo "Reviewed PR #$pull_number on $review_date"
                    fi
                done
                review_page=$((review_page + 1))
            done
        done
        page=$((page + 1))
    done
    
    echo ""
done

# Print the final total of your reviews
echo "Your total reviews across all repositories from $start_date to $end_date: $total_reviews"
