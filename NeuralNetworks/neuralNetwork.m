%% Machine Learning Online Class - Taken from Exercise 3 and 4

%% Initialization
%clear ; close all; clc

%{% Setup the parameters you will use for this exercise
input_layer_size  = 1200;  % 30x40 Input Images of Digits
hidden_layer_size = 600;   % 600 hidden units
num_labels = 3;          % 3 labels
%}
input_layer_size  = 8;  %  25x25 Input Images of Digits
hidden_layer_size = 5;   % 600 hidden units
num_labels = 3;         % 3 labels

%% =========== Part 1: Loading and Visualizing Data =============
%  We start the exercise by first loading and visualizing the dataset. 
%  You will be working with a dataset that contains handwritten digits.
%

% Load Training Data
fprintf('Loading and Visualizing Data ...\n')

%matrix				% Loading the big matrix
m = size(X, 1);

% Randomly select 25 data points to display
sel = randperm(size(X, 1));
sel = sel(1:25);

displayData(X(sel, :), 25);

fprintf('Program paused. Press enter to continue.\n');
pause;

%% ================ Part 2: Loading Parameters ================
%% ================ Part 3: Compute Cost (Feedforward) ================
%% =============== Part 4: Implement Regularization ===============
%% ================ Part 5: Sigmoid Gradient  ================

%% ================ Part 6: Initializing Pameters ================
%
fprintf('\nInitializing Neural Network Parameters ...\n')

Theta1 = randInitializeWeights(input_layer_size, hidden_layer_size);
Theta2 = randInitializeWeights(hidden_layer_size, num_labels);

% Unroll parameters
%{
% Instead of rancom initialisation load the theta from previous result:
load('theta1.mat');
load('theta2.mat');
%}
initial_nn_params = [Theta1(:) ; Theta2(:)];
%% =============== Part 7: Implement Backpropagation ===============
%% =============== Part 8: Implement Regularization ===============

%% =================== Part 8: Training NN ===================
%  You have now implemented all the code necessary to train a neural 
%  network. To train your neural network, we will now use "fmincg", which
%  is a function which works similarly to "fminunc". Recall that these
%  advanced optimizers are able to train our cost functions efficiently as
%  long as we provide them with the gradient computations.
%
fprintf('\nTraining Neural Network... \n')

%  After you have completed the assignment, change the MaxIter to a larger
%  value to see how more training helps.
options = optimset('MaxIter', 50);

%  You should also try different values of lambda
lambda = 1; %  pred ~ 64% with 25 

% Create "short hand" for the cost function to be minimized
costFunction = @(p) nnCostFunction(p, ...
                                   input_layer_size, ...
                                   hidden_layer_size, ...
                                   num_labels, X, y, lambda);

% Now, costFunction is a function that takes in only one argument (the
% neural network parameters)
[nn_params, cost] = fmincg(costFunction, initial_nn_params, options);

% Obtain Theta1 and Theta2 back from nn_params
Theta1 = reshape(nn_params(1:hidden_layer_size * (input_layer_size + 1)), ...
                 hidden_layer_size, (input_layer_size + 1));

Theta2 = reshape(nn_params((1 + (hidden_layer_size * (input_layer_size + 1))):end), ...
                 num_labels, (hidden_layer_size + 1));

fprintf('Program paused. Press enter to continue.\n');
%pause;

%
%% ================= Part 9: Visualize Weights =================
%  You can now "visualize" what the neural network is learning by 
%  displaying the hidden units to see what features they are capturing in 
%  the data.

fprintf('\nVisualizing Neural Network... \n')

displayData(Theta1(:, 2:end), 25);

fprintf('\nProgram paused. Press enter to continue.\n');
%pause;

%% ================= Part 10: Implement Predict =================
%  After training the neural network, we would like to use it to predict
%  the labels. You will now implement the "predict" function to use the
%  neural network to predict the labels of the training set. This lets
%  you compute the training set accuracy.

pred = predict(Theta1, Theta2, X);

fprintf('\nTraining Set Accuracy: %f\n', mean(double(pred == y)) * 100);