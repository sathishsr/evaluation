#!/bin/bash

# Define an array of repository paths
repositories=(
    "/path/to/first/repo"
    "/path/to/second/repo"
    # Add more paths as needed
)

# Define the date range
start_date="YYYY-MM-DD"
end_date="YYYY-MM-DD"

# Loop through each repository
for repo in "${repositories[@]}"; do
    if [ -d "$repo" ]; then
        cd "$repo"
        echo "Repository: $repo"
        # Count all commits in the date range
        total_commits=$(git rev-list --all --since="$start_date" --until="$end_date" --count)
        echo "Total commits from $start_date to $end_date: $total_commits"
        # Count your commits in the date range
        your_commits=$(git rev-list --all --author="Your Name or Email" --since="$start_date" --until="$end_date" --count)
        echo "Your commits from $start_date to $end_date: $your_commits"
        echo ""
    else
        echo "Directory $repo does not exist."
    fi
done
