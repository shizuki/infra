# -*- mode: ruby -*-
# vi: set ft=ruby :
# Vagrantの設定を開始する
Vagrant.configure("2") do |config|
  # boxはwate/amazon-linuxを使う
  config.vm.box = "wate/amazon-linux"
  # boxの自動アップデートをしない
  config.vm.box_check_update = false
  config.vbguest.no_remote = true
  # ポートフォワーディングの設定
  config.vm.network "forwarded_port", guest: 80, host: 80
  config.vm.network "forwarded_port", guest: 443, host: 443
  config.vm.network "forwarded_port", guest: 8601, host: 8601
  config.vm.network "forwarded_port", guest: 9000, host: 9000
  # ネットワーク設定
  # 固定
  #config.vm.network "private_network", ip: "192.168.1.222"
  # DHCP
  config.vm.network "private_network", type: "dhcp"
  # ホスト <=> ゲスト間の共有フォルダの設定
  config.vm.synced_folder "./html", "/var/www/html", type: "nfs"
  # Virtualboxの設定とVMのハードウェア的設定
  config.vm.provider "virtualbox" do |vb|
    # virtualboxのGUIは表示しない
    vb.gui = false
    # VMのメモリ設定(2GB)
    vb.memory = "2048"
    vb.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end
  # プロビジョニングの設定
  #ここから下はまっさらなOSのみのイメージをインポートした時に
  #アプリケーションのインストールやOSの設定をいじくるところ
  config.vm.provision "shell", inline: <<-SHELL
    # shellを起動してansibleの準備
    # ansible2、lamp-mariadb10.2-php7.2 epelのリポジトリを有効化
    sudo amazon-linux-extras install ansible2 lamp-mariadb10.2-php7.2 epel
    # ansible2をインストール
    sudo yum -y install ansible
    # node.jsのリポジトリをインストール
    curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
    # yarnのリポジトリをインストール
    curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
    # Jinja2とansibleのアップデート
    sudo easy_install pip
    sudo easy_install --upgrade pip
    sudo cp /usr/bin/pip /usr/sbin
    sudo pip install --upgrade Jinja2==2.8
    sudo pip install --upgrade ansible
  SHELL
  # ansibleでプロビジョニング
  config.vm.provision "ansible_local" do |ansible|
    ansible.become = true
    ansible.compatibility_mode = "2.0"
    ansible.playbook = "ansible/playbook.yml"
  end
end
