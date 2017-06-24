function [J grad] = nnCostFunction(nn_params, ...
                                   input_layer_size, ...
                                   hidden_layer_size, ...
                                   num_labels, ...
                                   X, y, lambda)
%NNCOSTFUNCTION Implements the neural network cost function for a two layer
%neural network which performs classification
%   [J grad] = NNCOSTFUNCTON(nn_params, hidden_layer_size, num_labels, ...
%   X, y, lambda) computes the cost and gradient of the neural network. The
%   parameters for the neural network are "unrolled" into the vector
%   nn_params and need to be converted back into the weight matrices. 
% 
%   The returned parameter grad should be a "unrolled" vector of the
%   partial derivatives of the neural network.
%

% Reshape nn_params back into the parameters Theta1 and Theta2, the weight matrices
% for our 2 layer neural network
Theta1 = reshape(nn_params(1:hidden_layer_size * (input_layer_size + 1)), ...
                 hidden_layer_size, (input_layer_size + 1));

Theta2 = reshape(nn_params((1 + (hidden_layer_size * (input_layer_size + 1))):end), ...
                 num_labels, (hidden_layer_size + 1));

% Setup some useful variables
m = size(X, 1);
         
% You need to return the following variables correctly 
J = 0;
Theta1_grad = zeros(size(Theta1));
Theta2_grad = zeros(size(Theta2));

% ====================== YOUR CODE HERE ======================
% Instructions: You should complete the code by working through the
%               following parts.
%
% Part 1: Feedforward the neural network and return the cost in the
%         variable J. After implementing Part 1, you can verify that your
%         cost function computation is correct by verifying the cost
%         computed in ex4.m
%
% Part 2: Implement the backpropagation algorithm to compute the gradients
%         Theta1_grad and Theta2_grad. You should return the partial derivatives of
%         the cost function with respect to Theta1 and Theta2 in Theta1_grad and
%         Theta2_grad, respectively. After implementing Part 2, you can check
%         that your implementation is correct by running checkNNGradients
%
%         Note: The vector y passed into the function is a vector of labels
%               containing values from 1..K. You need to map this vector into a 
%               binary vector of 1's and 0's to be used with the neural network
%               cost function.
%
%         Hint: We recommend implementing backpropagation using a for-loop
%               over the training examples if you are implementing it for the 
%               first time.
%
% Part 3: Implement regularization with the cost function and gradients.
%
%         Hint: You can implement this around the code for
%               backpropagation. That is, you can compute the gradients for
%               the regularization separately and then add them to Theta1_grad
%               and Theta2_grad from Part 2.
%

%time1 = time();

% PART 1
a1 = [ones(m, 1) X];

z2 = a1 * Theta1';
a2 = sigmoid(z2);
a2 = [ones(size(a2,1),1) a2];

z3 = a2 * Theta2';
a3 = sigmoid(z3);

newy = zeros(size(y),num_labels);
for k = 1:num_labels
	newy(:,k) = (y==k);
end
J = 0;
J = -(1/m)*(sum(sum( (log(a3).*newy) + (log(1-a3).*(1-newy)))));

%time2 = time();
%fprintf('Part 1     : %5f \n', time2 - time1)

% Regularise
J = J + (lambda/(2*m))*(sum(sum(Theta1(:,2:end).^2)) + sum(sum(Theta2(:,2:end).^2)))

%time3 = time();
%fprintf('Regularise : %5f \n', time3 - time2)

% PART 2

% Big delta defined as above
Theta1_grad = zeros(size(Theta1));
Theta2_grad = zeros(size(Theta2));

d2 = zeros(size(Theta1,1)+1,1);
d3 = zeros(size(Theta2,1),1);
D1 = zeros(size(Theta1));
D2 = zeros(size(Theta2));

a_1 = zeros(size([ones(m, 1) X](1,:)'));
a_2 = zeros(size([ones(m, 1) X](1,:)'));

%time4 = time();
%fprintf('Part 2     : %5f \n', time4 - time3)

X2 = [ones(m, 1) X];

%{%}
for t = 1:m
	% Step 1: forward pass
	a_1 = X2(t,:)'; % This takes a long time
	z_2 = Theta1 * a_1; % This a medium amount of time
	a_2 = sigmoid(z_2);
	a_2 = [1 ; a_2];
	z_3 = Theta2 * a_2;
	a_3 = sigmoid(z_3);

	% Step 2: the output layer
	d3 = a_3;
	d3(y(t)) = a_3(y(t))-1;

	% Step 3: the hidden layer
	d2 = (Theta2)' * d3 .* [1 ; sigmoidGradient(z_2)];

	% Step 4: accumulating gradient
	g = d2(2:end)*a_1'; % takes a lot of time
	D1 += g;
	D2 = D2 + d3*a_2';
end
%{
for t = 1:m
	% Step 1: forward pass
	time4_0 = time();
	a_1 = X2(t,:)'; % This takes a long time
	%fprintf('a_1 is %d x %d \n', size(a_1,1), size(a_1,2))
	time4_1 = time();
	z_2 = Theta1 * a_1; % This a medium amount of time
	time4_2 = time();
	a_2 = sigmoid(z_2);
	time4_3 = time();
	a_2 = [1 ; a_2];
	time4_4 = time();
	z_3 = Theta2 * a_2;
	time4_5 = time();
	a_3 = sigmoid(z_3);

	% Step 2: the output layer
	d3 = a_3;
	d3(y(t)) = a_3(y(t))-1;
	

	% Step 3: the hidden layer
	d2 = (Theta2)' * d3 .* [1 ; sigmoidGradient(z_2)];
	

	% Step 4: accumulating gradient
	time4_6 = time();
	g = d2(2:end)*a_1'; % takes a lot of time
	time4_7 = time();
	D1 += g; 
	time4_8 = time();
	fprintf('D1 is %d x %d \n', size(D1,1), size(D1,2))
	fprintf('d2 is %d x %d \n', size(d2,1), size(d2,2))
	fprintf('g is %d x %d \n', size(g,1), size(g,2))

	D2 = D2 + d3*a_2';
	time4_9 = time();

	fprintf('Part 2 1   : %5f \n', time4_1 - time4_0)
	fprintf('Part 2 2   : %5f \n', time4_2 - time4_1)
	fprintf('Part 2 3   : %5f \n', time4_3 - time4_2)
	fprintf('Part 2 4   : %5f \n', time4_4 - time4_3)
	fprintf('Part 2 5   : %5f \n', time4_5 - time4_4)
	fprintf('Part 2 6   : %5f \n', time4_6 - time4_5)
	fprintf('Part 2 7   : %5f \n', time4_7 - time4_6)
	fprintf('Part 2 8   : %5f \n', time4_8 - time4_7)
	fprintf('Part 2 9   : %5f \n', time4_9 - time4_8)

end
%}

%time5 = time();
%fprintf('Loop       : %5f \n', time5 - time4)

Theta1_grad(:,1) = D1(:,1)/m;
Theta2_grad(:,1) = D2(:,1)/m;
Theta1_grad(:,2:end) = (D1(:,2:end) + lambda * Theta1(:,2:end))/m;
Theta2_grad(:,2:end) = (D2(:,2:end) + lambda * Theta2(:,2:end))/m;

%time6 = time();
%fprintf('Grad       : %5f \n', time6 - time5)
% -------------------------------------------------------------

% =========================================================================

% Unroll gradients
grad = [Theta1_grad(:) ; Theta2_grad(:)];

end
