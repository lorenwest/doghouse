Example: boiler.service

Installing:

  cp boiler.service /lib/systemd/system/boiler.service


Starting/Stopping/Restarting

  systemctl enable boiler
  systemctl start boiler


Viewing the output: 

  journalctl -u boiler -f

