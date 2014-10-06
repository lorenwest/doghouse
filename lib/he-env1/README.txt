Example: he-env1.service

Installing:

  cp he-env1.service /lib/systemd/system/he-env1.service


Starting/Stopping/Restarting

  systemctl enable he-env1
  systemctl start he-env1


Viewing the output: 

  journalctl -u he-env1 -f

