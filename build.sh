npm run server &
P1=$!
npm run web &
P2=$!
wait $P1 $P2

