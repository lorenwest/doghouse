Example: garage.service

Installing:

  cp garage.service /lib/systemd/system/garage.service


Starting/Stopping/Restarting

  systemctl enable garage
  systemctl start garage


Viewing the output: 

  journalctl -u garage -f

