Example: benchtest.service

Installing:

  cp benchtest.service /lib/systemd/system/benchtest.service


Starting/Stopping/Restarting

  systemctl enable benchtest
  systemctl start benchtest


Viewing the output: 

  journalctl -u benchtest -f

