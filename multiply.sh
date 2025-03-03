for i in `git branch -a | grep remote | grep -v HEAD | grep -v master`;
do git branch --track ${i#remotes/origin/} $i;
done
