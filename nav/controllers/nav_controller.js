angular.module('NavController', ['firebase', 'ui.router','angularModalService', 'FirebaseFactories'])

.controller('NavCtrl', function ($scope, ProductList, ContactList, NavFirebase, ModalService) {

	$scope.nav = NavFirebase;

	$scope.showProductAdd = function() {
        ModalService.showModal({
            templateUrl: 'nav/templates/add-product-modal.html',
            controller: "ProductAddModalController"
        }).then(function(modal) {
            modal.element.modal();
            // modal.close.then(function(result) {
            //     $scope.message = "You said " + result;
            // });
        });
    };

	$scope.showContactAdd = function() {
        ModalService.showModal({
            templateUrl: 'nav/templates/add-contact-modal.html',
            controller: "ContactAddModalController"
        }).then(function(modal) {
            modal.element.modal();
        });
    };

    $scope.showProductMerge = function() {
        ModalService.showModal({
            templateUrl: 'nav/templates/product-merge-modal.html',
            controller: "ProductMergeModalController"
        }).then(function(modal) {
            modal.element.modal();
        });
    };     

})

.controller('ProductAddModalController', function($scope, close, ProductAPI, ProductsFirebase) {
  
	$scope.close = function(result) {
		close(result, 500); // close, but give 500ms for bootstrap to animate
	};

	function productExists(product) {
		return _.some(ProductsFirebase, { name: product.name });	
	}

	$scope.productAdd = function() {
		$scope.message = false;
		$scope.saved = false;

		if (productExists($scope.newProd)) {
			$scope.message = true;
			return;
		}

		ProductAPI.save($scope.newProd)
		.then(ref => $scope.saved = true)
		.catch(err => console.log(err));
	};

	// $scope.productAdd = function (result) {
	// 	console.log('testbutton');
	// 	ProductList.push($scope.newProd);
	// 	$scope.newProd = {};
	// };

})

.controller('ProductMergeModalController', function($scope, $q, close, ProductAPI, ProductsFirebase) {
  	$scope.products = ProductsFirebase;

	$scope.close = function(result) {
		close(result, 500);
	};

	function buildTmpProduct() {
		const keys = [
			'img',
			'name',
			'price'
		];

		var tmpProduct = {};
		var product1 = _.find(ProductsFirebase, {$id: $scope.option1.selectedOption.$id});
		var product2 = _.find(ProductsFirebase, {$id: $scope.option2.selectedOption.$id});

		console.log($scope.mergedProduct);
		console.log('product1', product1);
		console.log('product2', product2);
		
		keys.forEach(key => {
			tmpProduct[key] = $scope.mergedProduct[key].value1 ? product1[key] : product2[key];
		});
		
		console.log('tmpProduct', tmpProduct);

		return tmpProduct;
	}

	function mergeProducts() {
		var d = $q.defer();

		var tempProduct = buildTmpProduct();
		var product1 = $scope.option1.selectedOption;
  		var product2 = $scope.option2.selectedOption;

		$q.all(
			ProductAPI.remove(product1),
			ProductAPI.remove(product2)
		)
		.then(function(data) {
			return ProductAPI.save(tempProduct);
		})
		.then(d.resolve)
		.catch(d.reject);

		return d.promise;
	}

	$scope.productMerge = function() {

		$scope.merged = false;
		$scope.selectAttribues = false;
		$scope.selectProducts = false;
		var tmpProduct = {};

		if($scope.option1 === undefined ||
			$scope.option2 === undefined){
			$scope.selectProducts = true;
			return;
		}		

		if($scope.mergedProduct === undefined 
			|| $scope.mergedProduct.img === undefined
			|| $scope.mergedProduct.name === undefined
			|| $scope.mergedProduct.price === undefined){
			$scope.selectAttribues = true;
			return;
		}

	 	mergeProducts()
	 	.then(data => {
	 		$scope.merged = true;
	 	})
	 	.catch(err => console.log(err));	
	};

})

.controller('ContactAddModalController', function($scope, close, ContactAPI, ContactsFirebase) {
  	

	$scope.close = function(result) {
		close(result, 500); // close, but give 500ms for bootstrap to animate
	};

	function contactExists(contact) {
		return _.some(ContactsFirebase, { name: contact.name });	
	}

	// function contactExists(contact) {
	// 	var exists = false;

	// 	ContactsFirebase.forEach(c => {
	// 		if (c.name === contact.name) {
	// 			exists = true;
	// 		}
	// 	});

	// 	return exists;
	// };

	$scope.contactAdd = function() {
		$scope.message = false;
		$scope.saved = false;

		if (contactExists($scope.newcontact)) {
			$scope.message = true;
			return;
		}

		ContactAPI.save($scope.newcontact)
		.then(ref => $scope.saved = true)
		.catch(err => console.log(err));
	};
})
;