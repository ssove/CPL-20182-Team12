#!/bin/sh
# You should run it as root.

swapoff -a

apt-get update
apt-get install -y docker-engine

apt-get update && apt-get install -y apt-transport-https curl

curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add –

cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF

apt-get update
apt-get install -y kubelet kubeadm kubectl

systemctl daemon-reload
systemctl restart kubelet
