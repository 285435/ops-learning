echo "#git" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M mail
git remote add origin https://github.com/285435/ops-learning.git
git push -u origin mail
