export NO_COLOR=1
bun run build:all
bun run build

bun run train train --created-at 1743458652592 --message-id 79d1d3dd-098c-088e-9aa3-4b9a94820536 > train_log6.txt
bun run train train --created-at 1743458652592 --message-id 79d1d3dd-098c-088e-9aa3-4b9a94820536 > train_log5.txt

diff train_log5.txt train_log6.txt
