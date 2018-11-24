#!/bin/sh
# You should run it as root.

sudo su -

swapoff -a

apt-get update
apt-get install -y docker-engine

apt-get update && apt-get install -y apt-transport-https curl

curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add –

cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF

apt-get update
apt-get install -y kubernetes-cni=0.6.0-00
apt-get install -y kubelet=1.12.1-02 kubeadm=1.12.1-02 kubectl=1.12.1-02

systemctl daemon-reload
systemctl restart kubelet
