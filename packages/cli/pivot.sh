export NO_COLOR=1
bun run build:all
bun run build

bun run pivot > pivot_log6.txt
bun run pivot> pivot_log5.txt

diff pivot_log5.txt pivot_log6.txt
